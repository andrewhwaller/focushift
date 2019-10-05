# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Task, type: :model do
  subject { described_class.new }

  it 'is valid with valid attributes' do
    subject.name = 'Test'
    expect(subject).to be_valid
  end
  it 'is not valid without a name' do
    expect(subject).to_not be_valid
  end
  it 'is not valid without a user' do
    expect(subject).to_not be_valid
  end

  describe 'Associations' do
    it { should belong_to(:user) }
    it { should have_one(:project).class_name('Project').with_foreign_key('project_id') }
  end
end
