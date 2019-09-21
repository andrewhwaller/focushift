class Project < ApplicationRecord
  belongs_to :user
  has_many :tasks
  has_and_belongs_to_many :contexts
  has_and_belongs_to_many :partnerships

  validates :name, :presence => true
  validates :partnership_id, :numericality => true

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
