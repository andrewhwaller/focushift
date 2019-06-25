class TasksController < ApplicationController
  before_action :authenticate_user!
  before_action :set_active_user

  respond_to :html, :json
  
  def index
    @task = Task.new
    @tasks = current_user.tasks.where({status: "0", project_id: nil})
  end

  def new
    @task = Task.new
    respond_modal_with @task
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
    raise params.inspect
    # @task.update(task_params)
  end

  private

  def task_params
    params.require(:task).permit!
  end
end
