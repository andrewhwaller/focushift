class ContextsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_active_user
  
  def index
    @context = Context.new
    @contexts = current_user.contexts.all
  end

  def show
    @context = Context.find(params[:id])
  end

  def new
    @context = Context.new
  end

  def create
    @context = Context.new(context_params)
    @context.user_id = current_user.id
    if @context.save
      redirect_to contexts_path
    else 
      raise params.inspect
    end
  end

  def edit
    @context = Context.find(params[:id])
  end

  def update
    @context = Context.find(params[:id])
    @context.update(context_params)
    redirect_to contexts_path
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
