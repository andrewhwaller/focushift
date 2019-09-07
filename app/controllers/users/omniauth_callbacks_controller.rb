class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def google_oauth2
    @user = User.from_omniauth(request.env["omniauth.auth"])
    if @user.persisted?
      sign_in @user, :event => :authentication #this will throw if @user is not activated
      set_flash_message(:notice, :success, :kind => "Google") 
      if is_navigational_format?
        else
          session["devise.google_data"] = request.env["omniauth.auth"]
      end
      redirect_to '/'
    end
  end

  def facebook
    @user = User.from_omniauth(request.env["omniauth.auth"])
    @user.first_name = auth.first_name
    @user.last_name = auth.last_name
    sign_in_and_redirect @user
  end
end