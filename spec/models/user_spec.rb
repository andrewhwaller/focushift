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

  subject { described_class.new(password: "some_password", email: "john@doe.com") }

  describe "Validations" do
    it "is valid with valid attributes" do
      expect(subject).to be_valid
    end

    it "is not valid without a password" do
      subject.password = nil
      expect(subject).to_not be_valid
    end

    it "is not valid without an email" do
      subject.email = nil
      expect(subject).to_not be_valid
    end
  end

  describe "Associations" do
    it { should have_many(:tasks) }
    it { should have_many(:projects) }
    it { should have_many(:contexts) }
    it { should have_many(:partnerships) }
    it { should have_many(:partners) }
  end
end

