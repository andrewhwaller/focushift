class SessionsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_active_user
  
  def new
  end

  def create
  end
end
