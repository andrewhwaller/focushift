# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    first_name { "Dale" }
    last_name { "Cooper" }
    password { Faker::Internet.password(min_length: 8, max_length: 20) }
    password_confirmation { "#{password}" }
    sequence (:email) { |n| "test#{n}@example.com" }
  end
end
