# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User, type: :model do

  before(:all) do
    @user = build(:user)
  end
  
  describe 'Validations' do
    it 'is valid with valid attributes' do
      expect(@user).to be_valid
    end

    it 'is not valid without a password' do
      @user.password = nil
      expect(@user).to_not be_valid
    end

    it 'is not valid without an email' do
      @user.email = nil
      expect(@user).to_not be_valid
    end
  end

  describe 'Associations' do
    it { should have_many(:tasks) }
    it { should have_many(:projects) }
    it { should have_many(:contexts) }
    it { should have_many(:partnerships) }
    it { should have_many(:partners) }
  end
end
