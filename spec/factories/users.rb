# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    first_name "Dale"
    last_name "Cooper"
    email "dale@focushift.com"
    password "thisisatestpassword"
  end
end
