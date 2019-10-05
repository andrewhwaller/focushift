require 'rails_helper'

RSpec.describe Partnership, type: :model do
  describe 'Associations' do
    it { should belong_to(:user) }
    it { should belong_to(:partner) }
    it { should have_many(:project_partnerships) }
    it { should have_many(:projects).through(:project_partnerships) }
  end
end

