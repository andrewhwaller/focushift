# frozen_string_literal: true

# SessionsController
class SessionsController < ApplicationController
  before_action :authenticate_user!
  
  def new
  end

  def create
  end

  def destroy
  end
end
