class Task < ApplicationRecord
  belongs_to :user
  has_one :project, :class_name => 'Project', :foreign_key => 'project_id'
  
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
