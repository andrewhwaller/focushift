require 'rails_helper'

RSpec.describe Project, type: :model do
  describe 'Associations' do
    it { should belong_to(:user) }
    it { should have_many(:tasks)}
    it { should have_many(:project_contexts) }
    it { should have_many(:contexts).through(:project_contexts) }
    it { should have_many(:project_partnerships) }
    it { should have_many(:partnerships).through(:project_partnerships) }
  end
end