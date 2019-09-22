Rails.application.routes.draw do
  resources :partnerships do
    resources :projects
  end
  resources :projects do
    resources :tasks
  end
  resources :tasks
  resources :contexts do
    resources :projects
  end
  devise_for :users, :controllers => { omniauth_callbacks: "users/omniauth_callbacks" }
  devise_scope :user do
    get "/users/sign_out" => "devise/sessions#destroy"
  end

  root to: 'tasks#index'


  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
