class Project < ApplicationRecord
  belongs_to :user
  has_many :tasks
  has_many :project_contexts, dependent: :destroy
  has_many :contexts, through: :project_contexts
  has_many :project_partnerships
  has_many :partnerships, through: :project_partnerships

  scope :incomplete, -> { where(status: '0') }

  validates :name, presence: { message: "cannot be blank" }
  validates_uniqueness_of :name, scope: :user_id

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
