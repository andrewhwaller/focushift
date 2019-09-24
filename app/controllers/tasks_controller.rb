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
      @task = Task.new
      @tasks = current_user.tasks.search_results(params[:search])
    else
      @task = Task.new
      @tasks = current_user.tasks.incomplete_and_inboxed
    end
  end

  def show
    @task = Task.find(params[:id])
  end

  def new
    project_options
    @task = Task.new
    if params[:project_id]
      @task.project_id = params[:project_id]
    end
  end

  def create
    project_options
    @task = Task.new(task_params)
    @task.user_id = current_user.id
    render :new unless validate_object(@task)
  end

  def edit
    project_options
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

  def search
    @task = Task.new
    @tasks = current_user.tasks.search_results(params[:search])
    render :index
  end

  private

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
