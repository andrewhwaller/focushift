class TasksController < ApplicationController

  def index
    @task = Task.new
    @tasks = current_user.tasks.all
  end

  def show
    @task = Task.find(params[:id])
  end

  def create
    @task = Task.new(task_params)
    @task.user_id = current_user.id
    @task.save

    redirect_to '/'
  end

  private

  def task_params
    params.require(:task).permit(:name)
  end
end
