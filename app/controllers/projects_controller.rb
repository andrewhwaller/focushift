class ProjectsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_active_user
  
  def index
    @project = Project.new
    @projects = current_user.projects.all.incomplete
    @project.user_id = current_user.id
  end

  def show
    @project = Project.find(params[:id])
    @project_tasks = @project.tasks.incomplete
  end

  def new
    @context_options = current_user.contexts.all.map{ |c| [ c.name, c.id ] }
    @project = Project.new
  end

  def create
    @context_options = current_user.contexts.all.map{ |c| [ c.name, c.id ] }
    @project = Project.new(project_params)
    @project.user_id = current_user.id
    if @project.valid?
      @project.save
      redirect_to projects_path
    else
      render :new
    end
  end

  def edit
    @project = Project.find(params[:id])
  end

  def update
    @project = Project.find(params[:id])
    @project.update(project_params)
    if @project.valid?
      redirect_to projects_path
    else
      render :edit
    end
  end

  def destroy
    @project = Project.find(params[:id])
    @project.destroy
    redirect_to projects_path
  end

  private

  def partnership_options
    @partnership_options = current_user.partnerships.all
  end

  def project_params
    params.require(:project).permit!
  end
end
