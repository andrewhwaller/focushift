class ContextsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_active_user
  
  def index
    @context = Context.new
    @contexts = current_user.contexts.all
  end

  def show
    @context = Context.find(params[:id])
    @projects = @context.projects.all
  end

  def new
    @context = Context.new
    @context.user_id = current_user.id
  end

  def create
    @context = Context.new(context_params)
    @context.user_id = current_user.id
    if @context.valid?
      @context.save
      redirect_to contexts_path
    else
      render :new
    end
  end

  def edit
    @context = Context.find(params[:id])
  end

  def update
    @context = Context.find(params[:id])
    @context.update(context_params)
    if @context.valid?
      redirect_to contexts_path
    else
      render :edit
    end
  end

  def destroy
    @context = Context.find(params[:id])
    @context.destroy
    redirect_to contexts_path
  end

  private

  def context_params
    params.require(:context).permit!
  end
end
