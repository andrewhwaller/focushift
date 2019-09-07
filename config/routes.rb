Rails.application.routes.draw do
  resources :partnerships
  resources :projects
  resources :tasks
  resources :contexts
  devise_for :users, :controllers => { omniauth_callbacks: "users/omniauth_callbacks" }
  devise_scope :user do
    get '/users/sign_out' => 'devise/sessions#destroy'
  end

  root to: 'tasks#index'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
