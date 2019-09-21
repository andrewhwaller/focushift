class TasksController < ApplicationController
  before_action :authenticate_user!
  before_action :set_active_user
  
  def index
    if params[:project_id]
      @project = Project.find(params[:project_id])
      @task = Task.new
      @task.project_id = @project.id
      @tasks = @project.tasks
    else
      @task = Task.new
      @tasks = current_user.tasks.incomplete_and_inboxed
    end
  end

  def show
    @task = Task.find(params[:id])
  end

  def new
    @project_options = current_user.projects.all.map{ |p| [ p.name, p.id ] }
    @task = Task.new
  end

  def create
    @project_options = current_user.projects.all.map{ |p| [ p.name, p.id ] }
    @task = Task.new(task_params)
    @task.user_id = current_user.id
    render :new unless validate_object(@task)
  end

  def edit
    @task = Task.find(params[:id])
  end

  def update
    @task = Task.find(params[:id])
    @task.update(task_params)
    render :edit unless validate_task
  end

  def destroy
    @task = Task.find(params[:id])
    @task.destroy
    redirect_to tasks_path
  end

  private

  def task_params
    params.require(:task).permit!
  end

  def validate_task
    if @task.valid?
      @task.save
      redirect_to tasks_path
    end
  end
end
