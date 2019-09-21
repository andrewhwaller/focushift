class Project < ApplicationRecord
  belongs_to :user
  has_many :tasks
  has_and_belongs_to_many :contexts
  has_and_belongs_to_many :partnerships

  validates :name, presence: { message: "cannot be blank." }
  validates_uniqueness_of :name, conditions: -> { where.(user_id: current_user.id) }, { message: "You've already used that %{attribute}!" }
  validates :partnership_id, numericality: { message: "Something seems wrong with %{attribute}!" }

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
