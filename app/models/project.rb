class Project < ApplicationRecord
  belongs_to :user
  has_many :tasks
  has_and_belongs_to_many :contexts
  has_and_belongs_to_many :partnerships

  scope :owned_by_current_user, -> { where(user_id: current_user.id) }

  validates :name, presence: { message: "cannot be blank" }
  validates :name, uniqueness: { constraint: -> { owned_by_current_user } }

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
