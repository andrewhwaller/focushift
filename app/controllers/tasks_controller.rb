class TasksController < ApplicationController
  before_action :authenticate_user!
  before_action :set_active_user
  
  def index
    @task = Task.new
    @tasks = current_user.tasks.where({status: "0", project_id: nil})
  end

  def new
    @task = Task.new
  end

  def create
    @task = Task.new(task_params)
    @task.user_id = current_user.id
    if @task.save
      redirect_to '/'
    else 
      raise params.inspect
    end
  end

  def show
    @task = Task.find(params[:id])
  end

  def edit
    @task = Task.find(params[:id])
    render 'edit_task'
  end

  def update
    @task = Task.find(params[:id])
    @task.update(task_params)
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
