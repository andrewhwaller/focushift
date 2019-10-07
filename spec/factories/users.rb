# frozen_string_literal: true

FactoryBot.define do
  sequence :email do |n|
    "test#{n}@example.com"
  end

  factory :user do
    first_name { "Dale" }
    last_name { "Cooper" }
    email
    password { "thisisatestpassword" }
    password_confirmation { "thisisatestpassword" }
  end
end
