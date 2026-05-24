// Admin page for managing services: grouped list, add form, inline edit/delete
import { useState } from 'react'
import useServices from '../../hooks/useServices'
import ServicesList from '../../components/admin/services/ServicesList'
import ServiceEditForm from '../../components/admin/services/ServiceEditForm'

export default function AdminServicesPage() {
  const { services, loading, addService, editService, removeService } = useServices()
  const [editingId, setEditingId] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const handleSave = async (id, data) => {
    if (id) {
      await editService(id, data)
      setEditingId(null)
    } else {
      await addService(data)
      setShowAddForm(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return
    await removeService(id)
  }

  if (loading) return <p className="text-gray-500">Loading...</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Services</h2>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="text-sm border border-[#2a2a2a] rounded-xl px-4 py-2 hover:border-gray-500 transition-colors"
          >
            + Add service
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="mb-6">
          <ServiceEditForm
            service={null}
            onSave={handleSave}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {services.length === 0 && !showAddForm ? (
        <p className="text-gray-500 text-sm">No services yet</p>
      ) : (
        <ServicesList
          services={services}
          editingId={editingId}
          onEdit={setEditingId}
          onSave={handleSave}
          onCancel={() => setEditingId(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
