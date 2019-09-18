class ProjectsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_active_user
  
  def index
    @project = Project.new
    @projects = current_user.projects.all.where("status = '0'")
    @project.user_id = current_user.id
  end

  def show
    @project = Project.find(params[:id])
    @project_tasks = @project.tasks.where({status: "0"})
  end

  def new
    @context_options = current_user.contexts.all.map{ |c| [ c.name, c.id ] }
    @project = Project.new
  end

  def create
    @context_options = current_user.contexts.all.map{ |c| [ c.name, c.id ] }
    @project = Project.new(project_params)
    @project.user_id = current_user.id
    @project.save
    redirect_to projects_path
  end

  def edit
    @project = Project.find(params[:id])
  end

  def update
    @project = Project.find(params[:id])
    @project.update(project_params)
    redirect_to projects_path
  end

  def destroy
    @project = Project.find(params[:id])
    @project.destroy
    redirect_to projects_path
  end

  private

  def project_params
    params.require(:project).permit!
  end
end
