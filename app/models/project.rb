class Project < ApplicationRecord
  belongs_to :user
  has_many :tasks
  has_many :contexts
  has_many :users, through: :partnerships

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
