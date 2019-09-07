class ApplicationController < ActionController::Base
  protect_from_forgery prepend: true
  prepend_before_action :authenticate_user!
  before_action :configure_permitted_parameters, if: :devise_controller?
  
  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up) { |u| u.permit(:first_name, :last_name, :email, :password)}

    devise_parameter_sanitizer.permit(:account_update) { |u| u.permit(:first_name, :last_name, :email, :password, :current_password)}
  end

  private

  def set_active_user
    @active_user = current_user
    # @user_full_name = (current_user.first_name + " " + current_user.last_name)
  end
end
