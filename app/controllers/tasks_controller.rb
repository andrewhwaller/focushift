class TasksController < ApplicationController
  before_action :authenticate_user!
  
  def index
    @task = Task.new
    @tasks = current_user.tasks.all.where("status = '0'")
  end

  def show
    @task = Task.find(params[:id])
  end

  def create
    @task = Task.new(task_params)
    @task.user_id = current_user.id
    if @task.save
      redirect_to '/'
    end
  end

  def update
    @task = Task.find(params[:id])
    @task.update(task_params)
  end

  private

  def task_params
    params.require(:task).permit!
  end
end
