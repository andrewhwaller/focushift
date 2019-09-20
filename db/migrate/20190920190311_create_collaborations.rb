class CreateCollaborations < ActiveRecord::Migration[5.2]
  def change
    create_table :collaborations do |t|
      t.references :partnership, foreign_key: true
      t.references :project, foreign_key: true

      t.timestamps
    end
  end
end
