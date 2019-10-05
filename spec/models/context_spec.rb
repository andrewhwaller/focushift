# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Context, type: :model do
  describe 'Associations' do
    it { should belong_to(:user) }
    it { should have_many(:project_contexts) }
    it { should have_many(:projects).through(:project_contexts) }
  end
end
