class TasksController < ApplicationController

  def create
    @task = Task.new(task_params)
    if @task.save
      render "tasks/success"
    else
      render "tasks/failure"
    end
  end

  private

  def task_params
    params.require(:task).permit(:name)
  end
end
