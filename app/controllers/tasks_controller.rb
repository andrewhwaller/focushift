class TasksController < ApplicationController

  def index
    @task = Task.new
    @tasks = Task.all
  end

  def show
    @task = Task.find(params[:id])
  end

  def create
    @task = Task.new(task_params)
    @task.save

    redirect_to '/'
  end

  def update
    raise params.inspect
  end

  private

  def task_params
    params.require(:task).permit(:name)
  end
end
