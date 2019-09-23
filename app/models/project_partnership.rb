class ProjectPartnership < ActiveRecord::Base
    # Validations
    validates_presence_of :project, :partnership
  
    # Relations
    belongs_to :project
    belongs_to :partnership
end
