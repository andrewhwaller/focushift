Rails.application.routes.draw do
  resources :partnerships
  resources :projects
  resources :tasks
  resources :contexts
  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }

  root to: 'tasks#index'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
