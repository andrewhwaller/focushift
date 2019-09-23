class ContextsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_active_user
  
  def index
    @context = Context.new
    @contexts = current_user.contexts.all
  end

  def show
    @context = current_user.contexts.find(params[:id])
    @projects = @context.projects.all
  end

  def new
    @context = Context.new
    @context.user_id = current_user.id
  end

  def create
    @context = Context.new(context_params)
    @context.user_id = current_user.id
    render :new unless validate_object(@context)
  end

  def edit
    @context = current_user.contexts.find(params[:id])
  end

  def update
    @context = Context.find(params[:id])
    @context.update(context_params)
    render :edit unless validate_object(@context)
  end

  def destroy
    @context = current_user.contexts.find(params[:id])
    @context.destroy
    redirect_to contexts_path
  end

  private

  def context_params
    params.require(:context).permit(:name, :location)
  end
end
