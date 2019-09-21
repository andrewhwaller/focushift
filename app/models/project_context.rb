class ProjectContext < ActiveRecord::Base
    # Validations
    validates_presence_of :project, :context
  
    # Relations
    belongs_to :project
    belongs_to :context
end
