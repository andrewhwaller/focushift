# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User, type: :model do

  before(:all) do
    @test_user_1 = create(:user)
  end
  
  describe 'Validations' do
    it 'is valid with valid attributes' do
      expect(@test_user_1).to be_valid
    end

    it 'is not valid without a password' do
      @test_user_1.password = nil
      expect(@test_user_1).to_not be_valid
    end

    it 'is not valid without an email' do
      @test_user_1.email = nil
      expect(@test_user_1).to_not be_valid
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
