Rails.application.routes.draw do
  devise_for :users
  get 'sessions/new'
  get 'sessions/create'
  get 'site/index'

  get '/login', to: 'sessions#new'
  post '/login', to: 'sessions#create'
  post '/logout', to: 'sessions#destroy'

  get 'home', to: 'site#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
