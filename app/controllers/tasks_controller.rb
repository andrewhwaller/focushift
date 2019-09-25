# frozen_string_literal: true

# TasksController
class TasksController < ApplicationController
  before_action :authenticate_user!
  before_action :set_active_user
  
  def index
    if params[:project_id]
      @project = Project.find(params[:project_id])
      @task = Task.new
      @task.project_id = @project.id
      @tasks = @project.tasks
    elsif params[:search]
      @search_term = params[:search]
      @task = Task.new
      @tasks = current_user.tasks.search_results(@search_term)
    else
      @task = Task.new
      @tasks = current_user.tasks.incomplete_and_inboxed
    end
    # raise params.inspect
  end

  def show
    @task = Task.find(params[:id])
  end

  def new
    project_options
    @task = Task.new
    set_project_id
  end

  def create
    project_options
    @task = Task.new(task_params)
    @task.user_id = current_user.id
    render :new unless save_and_redirect_to_nested_index(@task)
  end

  def edit
    project_options
    @task = Task.find(params[:id])
  end

  def update
    @task = Task.find(params[:id])
    @task.update(task_params)
    render :edit unless save_and_redirect_to_nested_index(@task)
  end

  def destroy
    @task = Task.find(params[:id])
    @task.destroy
    redirect_to tasks_path
  end

  private

  def set_project_id
    if params[:project_id]
      @task.project_id = params[:project_id]
    end
  end

  def redirect_to_project_for_nested_task
    if params[:project_id]
      redirect_to current_user.projects.find(params[:project_id])
    else
      redirect_to action: "index"
    end
  end

  def task_params
    params.require(:task).permit(:name, :due_date, :status, :description, :project_id, :search)
  end

  def validate_task
    if @task.valid?
      @task.save
      redirect_to tasks_path
    end
  end

  def project_options
    @project_options = current_user.projects.all.incomplete.map{ |p| [ p.name, p.id ] }
  end
end
