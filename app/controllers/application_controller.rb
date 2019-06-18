class ApplicationController < ActionController::Base
  protect_from_forgery prepend: true
  before_action :authenticate_user!

  private

  def require_logged_in
  end

  def set_active_user
    @active_user = current_user
  end
end
