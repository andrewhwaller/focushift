# frozen_string_literal: true

# Task model
class Task < ApplicationRecord
  belongs_to :user
  has_one :project, :class_name => 'Project', :foreign_key => 'project_id'

  scope :incomplete_and_inboxed, -> { where(status: '0', project_id: nil) }
  scope :incomplete, -> { where(status: '0') }
  scope :search_results, -> (search_term) { where('name LIKE ?', "%#{search_term}%") }
  scope :due_this_week, -> { where(due_date: 1.week.ago..Date.today) }
  
  validates :name, presence: { message: "cannot be blank." }

  STATUS = {
    :incomplete => 0,
    :complete => 1
  }

  def complete?
    self.status == STATUS[:complete]
  end

  def incomplete?
    self.status == STATUS[:incomplete]
  end
end
