class ApplicationController < ActionController::Base
  protect_from_forgery prepend: true
  before_action :authenticate_user!

  def hello
  end

  private

  def require_logged_in
  end
end
