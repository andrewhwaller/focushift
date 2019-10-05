# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User, type: :model do
  it 'is database authenticatable' do
    user = User.create(
      email: 'test@example.com',
      password: 'testpassword',
      password_confirmation: 'testpassword'
    )
    expect(user.valid_password?('testpassword')).to be_truthy
  end
end

