//funcion asincrona para eliminar usuario por email con un DELETE a la API de usuarios

async function deleteUser(email) {
  try {
    const response = await fetch(`/api/users/${email}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar el usuario: ${response.statusText}`);
    }
    alert("Usuario eliminado correctamente");
    console.log("Usuario eliminado correctamente");
    location.reload();
  } catch (error) {
    console.error(error.message);
  }
}

//creo un popup que pide con un select el nuevo rol para el usuario y lo actualiza con la funcion updateRole

function editUser(email) {
  const roleUpdate = document.getElementById("roleUpdate");
  roleUpdate.style.display = 'block';
  roleUpdate.innerHTML = `
    <div class="row">
        <div class="col my-2 p-3 position-absolute top-50 start-50 translate-middle bg-secondary border border-2 rounded" style="max-width:50%;">\
        <div class="d-flex justify-content-end">
          <button type="button" class="btn-close" aria-label="Close" onclick="closePopup()"></button>
        </div>
        <h2 class="fw-bold fs-3 text-center" style="color:#f4ff80;">ROLE UPDATE</h2>
            <form id="updateRoleForm" class="d-flex gap-20">
                <label for="role" class="m-1 text-white fw-bold">Select Role:</label>
                <select name="role" id="role" class="form-select m-1" style="max-width:150px;">
                    <option value="user">user</option>
                    <option value="premium">premium</option>
                    <option value="admin">admin</option>
                </select>
                <input type="submit" class="btn btn-success m-1" value="Role Update">
            </form>
        </div>
    </div>
    `;
 
  document.getElementById("updateRoleForm").addEventListener("submit", (e) => {
    e.preventDefault();
    let role = document.getElementById("role").value;
    updateRole(email, role);
  });
} 



//funcion asincrona para actualizar el rol del usuario por email con un PUT a la API de usuarios
async function updateRole(email, role) {
  try {
    const response = await fetch(`/api/users/${email}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: role }),
    });

    if (!response.ok) {
      throw new Error(
        `Error al actualizar el rol del usuario: ${response.statusText}`
      );
    }
    alert("Rol actualizado correctamente");
    console.log("Rol actualizado correctamente");
    location.reload();
  } catch (error) {
    console.error(error.message);
  }
}


function closePopup() {
  // Puedes ocultar el popup o realizar cualquier otra acción para cerrarlo
  document.getElementById("roleUpdate").style.display = 'none';
}


