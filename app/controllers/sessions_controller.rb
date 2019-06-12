class SessionsController < ApplicationController
  before_action :authenticate_user!
  
  def new
    render :layout => 'login'
  end

  def create
  end
end
