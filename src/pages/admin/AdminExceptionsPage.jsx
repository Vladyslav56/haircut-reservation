// Admin page for managing employee days off: sorted list, add form, inline edit/delete
import { useEffect, useState } from 'react'
import useExceptions from '../../hooks/useExceptions'
import ExceptionCard from '../../components/admin/exceptions/ExceptionCard'
import ExceptionForm from '../../components/admin/exceptions/ExceptionForm'

export default function AdminExceptionsPage() {
  const { exceptions, loading, getAllExceptions, addException, editException, removeException } =
    useExceptions()
  const [editingId, setEditingId] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    getAllExceptions()
  }, [])

  const handleSave = async (id, data) => {
    if (id) {
      await editException(id, data)
      setEditingId(null)
    } else {
      await addException(data)
      setShowAddForm(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this day off?')) return
    await removeException(id)
  }

  const sorted = [...exceptions].sort((a, b) => a.date.localeCompare(b.date))

  if (loading) return <p className="text-gray-500">Loading...</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Days off</h2>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="text-sm border border-[#2a2a2a] rounded-xl px-4 py-2 hover:border-gray-500 transition-colors"
          >
            + Add
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="mb-6">
          <ExceptionForm
            exception={null}
            onSave={handleSave}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {sorted.length === 0 && !showAddForm ? (
        <p className="text-gray-500 text-sm">No days off added yet</p>
      ) : (
        <div className="space-y-3">
          {sorted.map((exception) => (
            <ExceptionCard
              key={exception.id}
              exception={exception}
              isEditing={editingId === exception.id}
              onEdit={setEditingId}
              onSave={handleSave}
              onCancel={() => setEditingId(null)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
