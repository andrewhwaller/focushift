class Project < ApplicationRecord
  belongs_to :user
  has_many :tasks
  has_and_belongs_to_many :contexts
  has_many :partnerships_projects
  has_many :partnerships, :through => :partnerships_projects

  validates :name, :presence => true

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
