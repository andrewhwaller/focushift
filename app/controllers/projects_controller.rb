class ProjectsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_active_user
  
  def index
    @project = Project.new
    @projects = current_user.projects.all.where("status = '0'")
  end

  def show
    @project = Project.find(params[:id])
  end

  def create
    @project = Project.new(project_params)
    @project.user_id = current_user.id
    if @project.save
      redirect_to '/projects#index'
    else 
      raise params.inspect
    end
  end

  def update
    @project = Project.find(params[:id])
    @project.update(project_params)
  end

  private

  def project_params
    params.require(:project).permit!
  end
end
