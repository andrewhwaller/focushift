class TasksController < ApplicationController
  before_action :authenticate_user!
  before_action :set_active_user
  
  def index
    @task = Task.new
    @tasks = current_user.tasks.where({status: "0", project_id: nil})
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
    if @task.valid?
      @task.save
      redirect_to tasks_path
    else
      render :new
    end
  end

  def edit
    @task = Task.find(params[:id])
  end

  def update
    @task = Task.find(params[:id])
    if @task.valid?
      @task.update(task_params)
      redirect_to tasks_path
    else
      render :edit
    end
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
end
