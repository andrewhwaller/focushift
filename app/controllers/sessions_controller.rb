class SessionsController < ApplicationController
  before_action :authenticate_user!
  
  def new
  end

  def create
  end

  def destroy
    redirect_to root_path
  end
end
