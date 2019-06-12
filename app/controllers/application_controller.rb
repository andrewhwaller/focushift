class ApplicationController < ActionController::Base
  protect_from_forgery prepend: true

  def hello
  end

  def current_user
  end

  private

  def require_logged_in
  end
end
