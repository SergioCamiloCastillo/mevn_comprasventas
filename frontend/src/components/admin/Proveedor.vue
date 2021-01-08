<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="personas"
        :search="search"
        sort-by="calories"
        class="elevation-1"
      >
        <template v-slot:[`item.estado`]="{ item }">
          <v-chip :color="getColor(item.estado)" dark>
            <div v-if="item.estado"><span> Activo</span></div>
            <div v-else><span> Inactivo</span></div>
          </v-chip>
        </template>
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Proveedores</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-text-field
              class="text-xs-center"
              v-model="search"
              append-icon="search"
              label="Búsqueda"
              single-line
              justify-center
              hide-details
            ></v-text-field>

            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  Nuevo
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" xs="12" sm="12" md="12">
                        <v-text-field
                          v-model="nombre"
                          label="Nombre"
                        ></v-text-field>
                      </v-col>
                      
                      <v-col cols="12" xs="12" sm="6" md="6">
                        <v-select
                          v-model="tipo_documento"
                          :items="documentos"
                          label="Tipo Documento"
                        >
                        </v-select>
                      </v-col>
                      <v-col cols="12" xs="12" sm="6" md="6">
                        <v-text-field
                          v-model="num_documento"
                          label="Número de documento"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" xs="12" sm="6" md="6">
                        <v-text-field
                          v-model="direccion"
                          label="Dirección"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" xs="12" sm="6" md="6">
                        <v-text-field
                          v-model="telefono"
                          label="Teléfono"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" xs="12" sm="6" md="6">
                        <v-text-field
                          v-model="email"
                          label="Email"
                        ></v-text-field>
                      </v-col>
                     
                      <v-col cols="12" sm="12" md="12" v-show="valida">
                        <div
                          class="red--text"
                          v-for="v in validaMensaje"
                          :key="v"
                          v-text="v"
                        ></div>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancelar
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="guardar">
                    Guardar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="headline"
                  >Are you sure you want to delete this item?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                    >OK</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="adModal" max-width="290">
              <v-card
                ><v-card-title class="headline" v-if="adAccion == 1"
                  >Activar Item</v-card-title
                ><v-card-title class="headline" v-if="adAccion == 2"
                  >Desactivar Item</v-card-title
                ><v-card-text
                  >Estas a punto de <span v-if="adAccion == 1"> activar</span
                  ><span v-else> desactivar</span> el item
                  <span class="font-weight-bold">{{
                    adNombre
                  }}</span></v-card-text
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    @click="activarDesactivarCerrar()"
                    class="green--text text--darken-1"
                    flat="flat"
                    >Cancelar</v-btn
                  >

                  <v-btn
                    v-if="adAccion == 1"
                    @click="activar()"
                    class="orange--text text--darken-4"
                    flat="flat"
                    >Activar</v-btn
                  >
                  <v-btn
                    v-if="adAccion == 2"
                    @click="desactivar()"
                    class="orange--text text--darken-4"
                    flat="flat"
                    >Desactivar</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:[`item.acciones`]="{ item }">
          <v-flex>
            <v-icon small class="mr-2 orange--text" @click="editItem(item)"
              >edit
            </v-icon>
            <span v-if="item.estado">
              <v-icon
                small
                class="mr-2 blue--text"
                @click="activarDesactivarMostrar(2, item)"
                >check
              </v-icon>
            </span>
            <span v-else>
              <v-icon
                small
                class="mr-2 red--text"
                @click="activarDesactivarMostrar(1, item)"
                >block
              </v-icon>
            </span>
          </v-flex>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">
            Reset
          </v-btn>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>
<script>
import axios from "axios";
export default {
  data: () => ({
    dialog: false,
    search: "",
    personas: [],

    headers: [
      { text: "Nombre", value: "nombre", sortable: true },
      { text: "Tipo Persona", value: "tipo_persona", sortable: true },
      { text: "Tipo Documento", value: "tipo_documento", sortable: true },
      { text: "Número Documento", value: "num_documento", sortable: true },
      { text: "Dirección", value: "direccion", sortable: true },
      { text: "Teléfono", value: "telefono", sortable: true },
      { text: "Email", value: "email", sortable: true },

      { text: "Estado", value: "estado", sortable: false },
      { text: "Acciones", value: "acciones", sortable: false },
    ],

    editedIndex: -1,
    _id: "",
    nombre: "",
    rol: "",
    tipo_persona: "Proveedor",
    tipo_documento: "",
    documentos: ["DNI", "CC"],
    num_documento: "",
    direccion: "",
    telefono: "",
    email: "",
   
    valida: 0,
    validaMensaje: [],
    adModal: 0,
    adAccion: 0,
    adNombre: "",
    adId: "",
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo registro" : "Editar registro";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.listar();
  },

  methods: {
    getColor(estado) {
      if (estado) {
        return "green";
      } else {
        return "red";
      }
    },
    validar() {
      this.valida = 0;
      this.validaMensaje = [];
     
      if (this.nombre.length < 1 || this.nombre.length > 50) {
        this.validaMensaje.push(
          "El nombre de la persona debe tener entre 1-50 caracteres."
        );
      }
      if (this.num_documento.length > 20) {
        this.validaMensaje.push(
          "El documento no debe tener más de 20 caracteres."
        );
      }
      if (this.direccion.length > 70) {
        this.validaMensaje.push(
          "La dirección no debe tener más de 70 caracteres."
        );
      }
      if (this.telefono.length > 20) {
        this.validaMensaje.push(
          "El teléfono no debe tener más de 20 caracteres."
        );
      }
      if (this.email.length < 1 || this.nombre.length > 50) {
        this.validaMensaje.push("El email debe tener entre 1-50 caracteres.");
      }
      
      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    listar() {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("persona/listProveedores", configuracion)
        .then(function(response) {
          me.personas = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    limpiar() {
      this._id = "";
      this.nombre = "";
      this.num_documento = "";
      this.direccion = "";
      this.telefono = "";
      this.email = "";
    

      this.valida = 0;
      this.validaMensaje = [];
      this.editedIndex = -1;
    },

    guardar() {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuracion = { headers: header };
      if (this.validar()) {
        return;
      }
      if (this.editedIndex > -1) {
        //Codigo para editar
        axios
          .put(
            "persona/update",
            {
              _id: this._id,
              tipo_persona: this.tipo_persona,
              nombre: this.nombre,
              tipo_documento: this.tipo_documento,
              num_documento: this.num_documento,
              direccion: this.direccion,
              telefono: this.telefono,
              email: this.email,
            },
            configuracion
          )
          .then(function(response) {
            me.limpiar();
            me.close();
            me.listar();
          })
          .catch(function(error) {
            console.log(error);
          });
      } else {
        //Codigo para guardar
        axios
          .post(
            "persona/add",
            {
              nombre: this.nombre,
              tipo_persona: this.tipo_persona,
              tipo_documento: this.tipo_documento,
              num_documento: this.num_documento,
              direccion: this.direccion,
              telefono: this.telefono,
              email: this.email,
           
            },
            configuracion
          )
          .then(function(response) {
            me.limpiar();
            me.close();
            me.listar();
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    activarDesactivarCerrar() {
      this.adModal = 0;
    },
    editItem(item) {
      this._id = item._id;
      this.nombre = item.nombre;
      this.rol = item.rol;
      this.num_documento = item.num_documento;
      this.tipo_documento = item.tipo_documento;
      this.direccion = item.direccion;
      this.telefono = item.telefono;
      this.email = item.email;
      this.password = item.password;
      this.dialog = true;
      this.editedIndex = 1;
    },

    activarDesactivarMostrar(accion, item) {
      this.adModal = 1;
      this.adNombre = item.nombre;
      this.adId = item._id;

      if (accion == 1) {
        this.adAccion = 1;
      } else if (accion == 2) {
        this.adAccion = 2;
      } else {
        this.adAccion = 0;
      }
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1);
      this.closeDelete();
    },
    activar() {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .put(
          "persona/activate",
          {
            _id: this.adId,
          },
          configuracion
        )
        .then(function(response) {
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
          me.listar();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    desactivar() {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .put(
          "persona/deactivate",
          {
            _id: this.adId,
          },
          configuracion
        )
        .then(function(response) {
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
          me.listar();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
  },
};
</script>
